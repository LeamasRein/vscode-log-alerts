## Configuration

`logAlerts.command` - specify the command to get the logs. Use tail in foreground mode.

Example:
> docker exec -i CONTAINER_NAME tail -n1 -f LOGS_PATH


`logAlerts.pattern` - specify a pattern for parsing logs.
Example:
> stderr: \\"(.+?)\\" while

## Commands

`logAlerts.reload` - reload configuration and restart log watcher.