# Milestone-2 WBD

## Deskripsi Aplikasi Web

Aplikasi ini merupakan versi sederhana dari LinkedIn, fitur yang ada tidak sepenuhnya ada seperti pada LinkedIn. Fitur-fitur yang diimplementasikan diantaranya adalah Connections, Chat, dan Feeds. Aplikasi ini menggunakan techstack react dan tailwind pada frontend, express.js pada backend.

## Cara Instalasi

- buat `.env` pada pada directory yang sama dengan `.env.example`
- pada `.env` backend atur terlebih dahulu `db` menjadi `localhost` agar dapat melakukan command

```bash
npx prisma migrate dev
```

- ubah kembali `.env` yang ada menjadi `db

## Cara menjalankan server

untuk mengaktifkan server gunakan command berikut

```bash
docker-compose up --build
```

- lalu akses website pada link [berikut](http://localhost:5173)

## [Dokumentasi API](http://localhost:3000/api-docs)

dokumentasi API tersedia pada link berikut
[Dokumentasi API](http://localhost:3000/api-docs)

- Link: http://localhost:3000/api-docs

## Pembagian Tugas

### Server Side

- Login: 13522119
- Register: 13522119
- Chat & Websocket: 13522119
- Feeds: 13522118, 13522093
- Connections: 13522118, 13522093
- Users Lists: 13522118
- Notifications: 13522093

### Client Side

- Login: 13522119
- Register: 13522119
- Chat: 13522119
- Feed: 13522118
- Connections: 13522118
- Users Lists: 13522118
- Notifications: 13522093
