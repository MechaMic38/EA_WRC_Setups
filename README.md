<div align="center">
    <img align="center" src="/docs/images/setup_list.png" alt="EA WRC Setups | Setup List" />
</div>

# EA WRC SETUPS

Project for the Web Programming &amp; Digital Services course, held at Università degli Studi di Brescia (Italy).
You can see the project in action in two separate videos:

- **End-User Perspective:** the end-user can search for setups, filter them based on various criteria (car, category, location, weather...), and view their details. If the user is logged in, they can also create and share their own setups. [[Youtube]](https://youtu.be/S2wnWEV2Wmo)
- **Admin Perspective:** the administrator can manage users, and all aspects of the application (available cars and locations, categories, manufacturers, and their associated images). [[Youtube]](https://youtu.be/rAsDtclXHMA)

<div align="center">
    <img align="center" src="/docs/images/car_setup.png" alt="EA WRC Setups | Car Setup" />
</div>

<div align="center">
    <img align="center" src="/docs/images/admin_view.png" alt="EA WRC Setups | Admin View" />
</div>

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
docker compose run --rm artisan storage:link
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
