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

```

### Calendar Synchronization

There is an api endpoint at `http://localhost:3000/api/ics` that allows synchronizing with a calendar.

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
