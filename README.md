# Web Hook POC
This Repository holds the webhook server that would track changes in webhook-main-repo repository.

## steps to run ngrok
* Open a terminal window 
* Run localhost server with has rest api implementation
* Open another terminal window and run following commands
```bash
# Install ngrok globally on your system
> npm install -g ngrok

# Run ngrok which will locate localhost server running on port 3001
> ngrok http 5052
```

## Pre-requisites
1) [Git command line tool](https://git-scm.com/downloads) should be installed.
2) [Hub command line tools](https://hub.github.com/) should be installed.
3) Git username and password should be added to system environment.
