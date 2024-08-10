@component('mail::message')
# Welcome 

Hello {{$name}},

Congratulations and welcome to the team! We are excited to have you at {{ config('app.name') }}. 
We know you're going to be a valuable asset to our company and are looking forward to 
the positive impact you're going to have here.

@component('mail::button', ['url' => $url ])
Create new Password
@endcomponent

If you’re having trouble clicking the "Create Password" button, copy and paste the URL below into your web browser: {{$url}}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
