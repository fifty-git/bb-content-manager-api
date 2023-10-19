import { describe, expect, test } from "bun:test";
import token from "../utils/sign-in";

describe("Groups Service", () => {
  test("Create Parent Group Success", async () => {
    const body = {
      name: "UNIT Test Parent Group",
    };
    const req = await fetch(`http://localhost:3000/api/v1/content-manager/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    });
    // const res = await req.json();
    expect(req.status).toBe(201);
  });
  test("Create Child Group Success", async () => {
    const body = {
      name: "UNIT Child Group",
      parent_group_id: 43,
    };
    const req = await fetch(`http://localhost:3000/api/v1/content-manager/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(req.status).toBe(201);
  });
  test("Create Child Group Error: Parent group is already a child group", async () => {
    const body = {
      name: "UNIT Child Group",
      parent_group_id: 44,
    };
    const req = await fetch(`http://localhost:3000/api/v1/content-manager/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(req.status).toBe(400);
  });
  test("Deactivate a Group Success", async () => {
    const req = await fetch(`http://localhost:3000/api/v1/content-manager/groups/43/deactivate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(req.status).toBe(200);
  });
  test("Activate a Group Success", async () => {
    const req = await fetch(`http://localhost:3000/api/v1/content-manager/groups/43/activate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(req.status).toBe(200);
  });
  test.skip("Deactivate a Group Error: Group not found", async () => {
    const req = await fetch(`http://localhost:3000/api/v1/content-manager/groups/-24/deactivate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(req.status).toBe(404);
  });
});
