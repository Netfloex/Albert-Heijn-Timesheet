# Api

### Features

-   Albert Heijn shifts timesheet
-   Nginx Top Stats

### Environment Variables

```
PRIVATEDATA=User Agent for nginx data
MARIADB=mariadb://root:password@hostname/table
AHUSERNAME=pnl
AHPASSWORD=password
DBPATH=/db
```

### Development

```
git clone https://github.com/Netfloex/Api Sam-Taen-Api
cd Sam-Taen-Api
yarn
yarn dev
```

### Docker

See [docker-compose.yml](docker-compose.yml)

Create a `.env` file
