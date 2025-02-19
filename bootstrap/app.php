<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        // channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
        then: function(){
            Route::middleware(['web', 'auth'])
            ->group(base_path('routes/channels.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\ShareCurrencyData::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'currency' => \App\Http\Middleware\ShareCurrencyData::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, $request) {
            if ($e instanceof NotFoundHttpException) {
                dd($e);
                return Inertia::render('Admin/Error404/Index') // Your 404 React component
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            // Return other exceptions normally
            return null;
        });
    })->create();
