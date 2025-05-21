APP_NAME=astro
PORT=3000

# Build de la imatge
build:
	docker compose build

# Inici en background
up:
	docker compose up -d

# Atura el servei
down:
	docker compose down

# Mira els logs
logs:
	docker compose logs -f

# Reconstrueix i reinicia
restart:
	docker compose down
	docker compose build
	docker compose up -d

# Obre al navegador (Linux amb xdg-open, canvia segons OS)
open:
	xdg-open http://localhost:$(PORT)

# Neteja tot (codi + volums si cal)
clean:
	docker system prune -f
