# hapi-validation-question

Hapi.js Validation with Joi + `failAction` question.

## Situation

We want to build a "*traditional*" **server-side**-***only***
rendered application using **Hapi**.

While trying to *understand* how to avoid returning a "*raw*" `400`
error to the client when `Joi` validation *fails*:

![register-iphone4s-sim](https://cloud.githubusercontent.com/assets/194400/10234331/a863744a-688b-11e5-9eb8-5e41d0f570e2.png)

We want to intercept the "*email not allowed to be empty*" (*Joi*)
**validation error** and *instead* display the *error message*
in the ***html template*** to the client,
rather than returning the `400` error.

[@AdriVanHoudt](https://github.com/hapijs/joi/issues/725#issuecomment-144482794) advised that we should:
> "Look at `failAction` under http://hapijs.com/api#route-options "

And [@MattHarrison](https://github.com/hapijs/joi/issues/725#issuecomment-144867144) elaborated that the `failAction` should be a function.

See code in:
[**server.js**](https://github.com/nelsonic/hapi-validation-question/blob/master/server.js)

So we added `failAction` which ***re-uses*** the `register_handler`
so that the `registration-form.html` is shown with any input validation error message:

```js
{
  method: '*',
  path: '/register',
  config: {
    validate: {
      payload : register_fields,
      failAction: register_handler
    }
  },
  handler: register_handler
}
```

the `register_handler` is:

```js
function register_handler(request, reply, source, error) {
  var errors, values; // return empty if not set.
  if(error && error.data) { // means the handler is dual-purpose
    errors = extract_validation_error(error); // the error field + message
    values = return_form_input_values(error); // avoid wiping form data
  }
  // show the registration form until its submitted correctly
  if(!request.payload || request.payload && error){
    return reply.view('registration-form', {
        title  : 'Please Register ' + request.server.version,
        error  : errors,
        values : values
    });
  }
  else { // once successful, show welcome message!
    return reply.view('welcome-message', {
      name  : validator.escape(request.payload.name),
      email : validator.escape(request.payload.email)
    })
  }
}
```
Where `extract_validation_error(error)` and `return_form_input_values(error)`
are helper functions defined within `server.js` (*but would be split out into view helpers*) which keep our handler function lean.

When we submit the form without any of the required fields we see:

![register-1of4](https://cloud.githubusercontent.com/assets/194400/10266518/ce0c2ba6-6a61-11e5-89bc-4abf33b30f21.png)

![register-3of4](https://cloud.githubusercontent.com/assets/194400/10266523/680d1922-6a62-11e5-9533-3560a646dfd0.png)

We also use https://github.com/chriso/validator.js
to mitigate [Cross Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)
vulnerability:

Avoids Cross Site Scripting:
![register-hack-1of2](https://cloud.githubusercontent.com/assets/194400/10267320/5dd3bad6-6a87-11e5-888b-f1e1dbbf9f39.png)

Displays welcome message on successful registration:
![reg-success-1of2](https://cloud.githubusercontent.com/assets/194400/10267355/c7d8a31e-6a88-11e5-8bf9-3bb148e2d870.png)
