defmodule Microblogger.CommentControllerTest do
  use Microblogger.ConnCase

  alias Microblogger.{User, Comment}
  
  @user_attrs %{email: "some_email", password: "some_pass", bio: "some_bio", username: "some_user"}

  setup %{conn: _} do
    current_user = User.registration_changeset(%User{}, @user_attrs) |> Repo.insert!
    new_conn     = build_conn() |> post(session_path(build_conn(), :create), @user_attrs)
    jwt          = new_conn.private.guardian_default_jwt

    [
      %{title: "z", source: "y", quote: "x", is_public: true},
      %{title: "w", source: "v", quote: "u", is_public: true},
      %{title: "t", source: "s", quote: "r.", is_public: false}
    ]
      |> Enum.map(&User.create_post(&1, current_user))
      |> Enum.each(&Repo.insert!(&1))

    user_posts = current_user |> Repo.preload(:posts)
    posts      = user_posts.posts

    first  = posts |> Enum.at(0)
    second = posts |> Enum.at(1)

    c1 = %{body: "test1", post_id: first.id, user_id: current_user.id}
    c2 = %{body: "test2", post_id: second.id, user_id: current_user.id}

    Ecto.build_assoc(current_user, :comments, c1) |> Repo.insert
    Ecto.build_assoc(current_user, :comments, c2) |> Repo.insert

    conn = build_conn() 
      |> put_req_header("authorization", "Bearer #{jwt}")

    {:ok, conn: conn, user: current_user}
  end

  test "returns all comments", %{conn: conn, user: user} do
    conn = get(conn, user_comment_path(build_conn(), :index, user))
    data = json_response(conn, 200)["data"]
    assert length(data) == 2
    
    test1 = data |> Enum.at(0)
    test2 = data |> Enum.at(1)

    assert test1["body"] == "test1"
    assert test2["body"] == "test2"
  end
end
