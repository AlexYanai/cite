defmodule Microblogger.FavoriteTest do
  use Microblogger.ModelCase

  alias Microblogger.{Favorite}

  @valid_attrs %{post_id: 1, user_id: 1}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Favorite.changeset(%Favorite{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Favorite.changeset(%Favorite{}, @invalid_attrs)
    refute changeset.valid?
  end
end
