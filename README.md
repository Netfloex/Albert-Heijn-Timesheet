# Albert Heijn Shifts Timesheet

![albert-heijn-timesheet](https://user-images.githubusercontent.com/38650595/190021928-1de52e0a-41c7-45f9-a23a-57c1caad6c7e.png)

### Environment Variables

```bash
# Required
AH_USERNAME=pnl
AH_PASSWORD=password

# Optional
TZ=Europe/Amsterdam
STORE_PATH=/db

# The calendar to *overwrite* with shifts data
CALDAV_URL=https://radicale
CALDAV_USERNAME=user
CALDAV_PASSWORD=password

# (Optional) amount of minutes when your calendar should remind you
# Default is 60 minutes
CALDAV_NOTIFY_MINUTES=120,15
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
