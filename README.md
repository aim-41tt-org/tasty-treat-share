
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1a9be471-0d28-40fa-b4b8-a688b4f9c959

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1a9be471-0d28-40fa-b4b8-a688b4f9c959) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Running with Docker

You can run this application in a Docker container for a consistent environment across platforms. Follow these steps:

### Prerequisites
- Install [Docker](https://docs.docker.com/get-docker/) on your system

### Steps to run with Docker

1. **Create a Dockerfile** in the root of your project:

```
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

2. **Build the Docker image**:

```sh
docker build -t recipe-app .
```

3. **Run the container**:

```sh
docker run -p 5173:5173 recipe-app
```

4. **Access your application** at http://localhost:5173

### Using Docker Compose (optional)

For a more streamlined development experience, you can use Docker Compose:

1. **Create a docker-compose.yml file**:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
```

2. **Start the application with**:

```sh
docker-compose up
```

3. Any changes you make to your files will be reflected in real-time.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1a9be471-0d28-40fa-b4b8-a688b4f9c959) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
