defmodule Microblogger.Repo.Migrations.CreateFavorite do
  use Ecto.Migration

  def change do
    create table(:favorites) do
      add :post_id, references(:posts, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:favorites, [:post_id])
    create index(:favorites, [:user_id])
  end
end
