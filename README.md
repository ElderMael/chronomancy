# Chronomancy


## NAME

chronomancy

## SYNOPSIS

```bash
chronomancy [COMMAND] [OPTIONS]
```

## DESCRIPTION

chronomancy is a small utility to keep timesheets based on
(timetrap)[1].

## COMMANDS

### in

Creates a new task, by default at current time


#### Options

##### at

Creates the task at the specified time e.g.

```bash
chronomancy start --at "10 AM" TECH "Update README"
```

### out

Ends the current task

[1]: https://github.com/samg/timetrap
