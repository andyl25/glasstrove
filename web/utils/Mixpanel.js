import mixpanel from 'mixpanel-browser';
mixpanel.init('68b59cb5e7c25779bf99d73a1234eed9', {api_host: "https://api.mixpanel.com"});

// let env_check = process.env.NODE_ENV === 'production';
let env_check = true;

let actions = {
  identify: (id) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;