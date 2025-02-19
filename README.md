# EA WRC SETUPS

Project for the Web Programming &amp; Digital Services course, held at Università degli Studi di Brescia (Italy).

## How To Use

First of all, you need to make a copy of the file `.env.example` in the project root folder, and rename it as `.env`. This also need to be done with the `.env.example` file within the `src` folder.

> Remember to set all appropriate environment variables, if needed.

### First launch

For the first launch of the program, you must execute the following command. This creates all the containers necessary to run the application.

```bash
docker compose up --build
```

After that completes, run the following to install and compile the dependencies for the application:

```bash
docker compose run --rm composer install
docker compose run --rm npm install
docker compose run --rm npm run build
```

Then, you need to create a symbolic link from source directory `storage/app/public` to target directory `public/storage`. This enables all files within the target directory to be accessible from the web. To do so, type:

```bash
php artisan storage:link
```

Finally, launch all application containers, and run the necessary migrations and seeders:

```bash
docker compose up
docker compose run --rm artisan migrate
docker compose run --rm artisan db:seed
```

### Subsequent Launches

For all subsequent launches, you just need to execute:

```bash
docker compose up
```

When you are finished, you can close the application (and destroy all containers) by using:

```bash
docker compose down
```

You can access the application through [http://localhost:8080/](http://localhost:8080/).
