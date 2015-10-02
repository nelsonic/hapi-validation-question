# hapi-validation-question

Hapi.js Validation with Joi + `failAction` question.

## Situation

We want to build a "*traditional*" **server-side**-***only***
rendered application using **Hapi**.

I'm trying to *understand* how to avoid returning a "*raw*" `400`
error to the client when `Joi` validation *fails*:

![register-iphone4s-sim](https://cloud.githubusercontent.com/assets/194400/10234331/a863744a-688b-11e5-9eb8-5e41d0f570e2.png)

We want to intercept this "*email not allowed to be empty*" **validation error** and display it in the html template back to the client,
instead of simply returning the `400` error.

[@AdriVanHoudt](https://github.com/hapijs/joi/issues/725#issuecomment-144482794) advised that we should:
> "Look at failAction under http://hapijs.com/api#route-options "

See code in:
[**server.js**](https://github.com/nelsonic/hapi-validation-question/blob/master/server.js)

So we added `failAction: 'log'` to the `/register` route handler:

```js
{
  method: '*',
  path: '/register',
  config: {
    validate: {
      payload : register_fields,
      failAction: 'log'
    }
  },
  handler: register_handler
}
```

the `register_handler` is:

```js
function register_handler(request, reply, source, error) {
  console.log(request.payload);
  console.log(' - - - - - - - - - - - - - - - - - - - - -');
  console.log(source)
  console.log(' - - - - - - - - - - - - - - - - - - - - -');
  console.log(error)
  return reply('welcome!');
}
```

When we submit the form without any of the required fields we see:


```sh
{ name: '', email: '' }
 - - - - - - - - - - - - - - - - - - - - -
payload
 - - - - - - - - - - - - - - - - - - - - -
{
  "data": {
    "name": "ValidationError",
    "details": [
      {
        "message": "\"email\" is not allowed to be empty",
        "path": "email",
        "type": "any.empty",
        "context": {
          "key": "email"
        }
      }
    ],
    "_object": {
      "name": "",
      "email": ""
    }
  },
  "isBoom": true,
  "isServer": false,
  "output": {
    "statusCode": 400,
    "payload": {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "child \"email\" fails because [\"email\" is not allowed to be empty]",
      "validation": {
        "source": "payload",
        "keys": [
          "email"
        ]
      }
    },
    "headers": {}
  }
}
```

I asked the question on GitHub: https://github.com/hapijs/joi/issues/725
but have not yet got an answer with a *good* ***example***.
