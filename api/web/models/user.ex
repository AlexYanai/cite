defmodule Microblogger.User do
  use Microblogger.Web, :model

  schema "users" do
    field :username, :string
    field :email, :string
    field :bio, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    has_many :posts, Microblogger.Post
    has_many :favorites, Microblogger.Favorite

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:username, :email, :bio])
    |> validate_required([:username, :email])
    |> unique_constraint(:username)
    |> unique_constraint(:email)
  end

  def registration_changeset(struct, params) do
    struct
    |> changeset(params)
    |> cast(params, [:password])
    |> validate_length(:password, min: 6, max: 100)
    |> put_password_hash()
  end

  def create_post(post, user) do
    post = Map.put(post, :author_name, user.username)
    post = Map.put(post, :author_emai, user.email)
    
    Ecto.build_assoc(user, :posts, post)
  end

  def favorites(user) do
    user |> assoc(:favorites) |> Microblogger.Repo.all
  end

  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        changeset
    end
  end
end
