<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'SMS') }}</title>
    @vite(['src/assets/scss/app.scss'])
    <link rel="stylesheet" href="src/assets/scss/custom/plugins/icons/_ionicons.min.scss">
</head>
<body>
    <main id="app"></main>
    @include ('footer')
    {{-- @viteReactRefresh --}}
    @vite(['src/assets/scss/app.scss' , 'src/index.jsx'])
</body>
</html>
