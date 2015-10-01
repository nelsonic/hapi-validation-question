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
[**server.js**](https://github.com/nelsonic/hapi-validation-question/blob/d1b815a9ffe789f588b21b9c5f23dbaaf36758a0/server.js)

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

I am expecting to see an error in the terminal/console
but when I try to `console.log` the `handler` :


```sh
- - - - - - - - - - - - - - - - - - - - -
undefined
- - - - - - - - - - - - - - - - - - - - -
undefined
```

I asked the question on GitHub: https://github.com/hapijs/joi/issues/725
but have not yet got an answer with a *good* ***example***.
