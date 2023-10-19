import { describe, expect, it } from "bun:test";
import app from "~/app";
import token from "../utils/sign-in";

describe("Groups Service", () => {
  it("Create Parent Group Success", async () => {
    const body = {
      name: "UNIT Test Parent Group",
    };
    const req = new Request(`http://localhost:3000/api/v1/content-manager/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(201);
  });
  it("Create Child Group Success", async () => {
    const body = {
      name: "UNIT Child Group",
      parent_group_id: 43,
    };
    const req = new Request(`http://localhost:3000/api/v1/content-manager/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(201);
  });
  it("Create Child Group Error: Parent group is already a child group", async () => {
    const body = {
      name: "UNIT Child Group",
      parent_group_id: 44,
    };
    const req = new Request(`http://localhost:3000/api/v1/content-manager/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(400);
  });
  it("Deactivate a Group Success", async () => {
    const req = new Request(`http://localhost:3000/api/v1/content-manager/groups/43/deactivate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("Activate a Group Success", async () => {
    const req = new Request(`http://localhost:3000/api/v1/content-manager/groups/43/activate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("Deactivate a Group Error: Group not found", async () => {
    const req = new Request(`http://localhost:3000/api/v1/content-manager/groups/-24/deactivate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(404);
  });
});
