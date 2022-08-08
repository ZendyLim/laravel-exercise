## What you need
This project is created with [Sail](https://laravel.com/docs/9.x/sail)

You can run `sail up` to have all the development container ready.

You also can utilize VSCode `devcontainer` after above commands

## Commands that you probably need to run
```
# copy .env.example to .env
cp .env.example .env

# For symlink storage to public folder (used for profile picture)
php artisan storage:link

# Migrations + Seed
php artisan migrate
php artisan db:seed

# You can build latest build of frontend
npm run prod

# Or you can use hot module reload on development
npm run dev

# Mail all admin client list
# NOTE: you can monitor this using mailhog on http://localhost:8025/
php artisan mail:clients

# Manually run cron 
php artisan schedule:run
```

