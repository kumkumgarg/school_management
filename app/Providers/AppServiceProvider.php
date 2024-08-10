<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \URL::forceScheme('https');

        // Get the current request URI
        $requestUri = $this->app->request->getRequestUri();

        // Parse the URI to get query parameters
        $urlComponents = parse_url($requestUri);
        $initialRequestUri = $requestUri;

        if (isset($urlComponents['query'])) {
            // Parse the query parameters into an associative array
            parse_str($urlComponents['query'], $queryParams);

            if (isset($queryParams['redirect_uri'])) {
                // Store the entire request URI if it's an OAuth request
                session(['redirect_uri' => $initialRequestUri]);
            }
        }

        //Deploying Passport
        Passport::loadKeysFrom(__DIR__.'/../secrets/oauth');

        // Token Lifetimes
        // By default, Passport issues long-lived access tokens that expire after one year.
        Passport::tokensExpireIn(now()->addDays(1));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
    }
}
