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

* `-- at` creates the task at the specified time. Human readable
  input can be parsed.

```bash
chronomancy start --at "10 AM" TECH "Update README"
```

### out

Ends the current task

#### Options

* `-- at` ends the task at the specified time. Human readable
  input can be parsed.

```bash
chronomancy out --at "5 minutes ago"
```

[1]: https://github.com/samg/timetrap
