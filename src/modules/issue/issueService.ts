import { pool } from "../../db/db.js";

export const issueService = {
  // ১. Create Issue
  async createIssue(title: string, description: string, type: string, reporter_id: number) {
    const insertQuery = `
      INSERT INTO issues (title, description, type, reporter_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [title, description, type, reporter_id]);
    return result.rows[0];
  },

  // ২. Get All Issues (Without SQL JOIN)
  async getAllIssues(sort: string, type?: string, status?: string) {
    let query = `SELECT * FROM issues WHERE 1=1`;
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }
    if (status) {
      query += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    const order = sort === "oldest" ? "ASC" : "DESC";
    query += ` ORDER BY created_at ${order}`;

    const issuesResult = await pool.query(query, queryParams);
    const issues = issuesResult.rows;

    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];
    const usersQuery = `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`;
    const usersResult = await pool.query(usersQuery, [reporterIds]);

    const usersMap = usersResult.rows.reduce<
      Record<number, { id: number; name: string; role: string }>
    >((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    return issues.map((issue) => ({
      ...issue,
      reporter: usersMap[issue.reporter_id],
      reporter_id: undefined,
    }));
  },

  // ৩. Get Single Issue
  async getIssueById(id: number) {
    const issueQuery = `SELECT * FROM issues WHERE id = $1`;
    const issueResult = await pool.query(issueQuery, [id]);
    const issue = issueResult.rows[0];

    if (!issue) return null;

    const userQuery = `SELECT id, name, role FROM users WHERE id = $1`;
    const userResult = await pool.query(userQuery, [issue.reporter_id]);
    issue.reporter = userResult.rows[0];
    delete issue.reporter_id;

    return issue;
  },

  // ৪. Update Issue
  async updateIssue(
    id: number,
    title?: string,
    description?: string,
    type?: string,
    status?: string,
  ) {
    const updateQuery = `
      UPDATE issues 
      SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        type = COALESCE($3, type), 
        status = COALESCE($4, status), 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [title, description, type, status, id]);
    return result.rows[0];
  },

  // ৫. Delete Issue
  async deleteIssue(id: number) {
    const deleteQuery = `DELETE FROM issues WHERE id = $1 RETURNING id`;
    const result = await pool.query(deleteQuery, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },
};
