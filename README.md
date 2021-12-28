# Albert Heijn Shifts Timesheet

<!-- ### Features

-   Albert Heijn shifts timesheet -->

### Environment Variables

```bash
AH_USERNAME=pnl
AH_PASSWORD=password
STORE_PATH=/db
# See https://github.com/caronc/apprise/wiki
NOTIFIERS=apprise://

# If there should be a notification on start
NOTIFY_START=false
```

### Development

```
git clone https://github.com/Netfloex/Albert-Heijn-Timesheet
cd Albert-Heijn-Timesheet
yarn
yarn dev
```

### Docker

See [docker-compose.yml](docker-compose.yml)

Create a `.env` file
