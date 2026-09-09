import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { teacher, token } from "../test/fixtures";

function AuthProbe() {
  const { isAuthenticated, user, signIn, signOut } = useAuth();
  return (
    <div>
      <output>{isAuthenticated ? "authenticated" : "anonymous"}</output>
      <span>{user?.name ?? "no-user"}</span>
      <button onClick={() => signIn(token, teacher)}>sign-in</button>
      <button onClick={signOut}>sign-out</button>
    </div>
  );
}

describe("AuthContext", () => {
  it("persiste login, restaura sessão e encerra sessão", async () => {
    const user = userEvent.setup();
    const view = render(<AuthProvider><AuthProbe /></AuthProvider>);

    await user.click(screen.getByRole("button", { name: "sign-in" }));
    expect(screen.getByText("authenticated")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("auth_user") ?? "null")).toEqual(teacher);

    view.unmount();
    render(<AuthProvider><AuthProbe /></AuthProvider>);
    expect(screen.getByText("authenticated")).toBeInTheDocument();
    expect(screen.getByText(teacher.name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "sign-out" }));
    expect(screen.getByText("anonymous")).toBeInTheDocument();
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});