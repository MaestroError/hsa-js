<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Document Title') }}</title>
</head>
<body>

    <!-- Simple string test -->
    <p>{{ __('Testing string') }}</p>
    <p>{{ __('Testing number 1245') }}</p>

    <!-- Some ignoring characters test -->
    <p>{{ __('hastag double #') }}</p>
    <p>_underscore _</p>
    <!-- Some warning characters test -->
    <p>Testing not found {} () string</p>
    <p>% Percent %</p>
    <p>Testing 'single' quotes</p>
    <p>Testing single 'quotes'</p>
    <input placeholder="Some text with 'quotes'" />
    <!-- XX Cant find last single quoted word - SOLVED! -->
    <p>{{ __('John with') }} 'single'</p>


    <!-- Other tests -->
    <p>{{ __('Testing dash - string') }}</p>
    <p>{{ __('Testing non-latin სატესტო') }}</p>


    <!-- Placeholder test +case insensitive and single-quotes -->
    <input placeholder="{{ __('Enter some text') }}" />
    <input Placeholder='{{ __('Some text 2') }}' />

    <!-- XX replaces first placeholder  - SOLVED! (passing) -->
    <input Placeholder='{{ __('test Placeholder') }}' />
    <input placeholder="placeholder" />


    <!-- other tests -->
    <img alt="{{ __('Alt text for image') }}" />

    <!-- Hashtag extraction -->
    <input type="submit" value="{{ __('Send') }}" />
    <input type="submit" value=" {{ __('value') }}" />
    <input type="submit" value="  {{ __('Recived') }}" />
    <!-- XX it ignores this string because of duplicate check - SOLVED! -->
    <p>{{ __('John but no quotes') }}</p>

    <!-- Title extraction (with double quotes) -->
    <p title='{{ __('John "ShotGun" Nelson') }}'>{{ __('John with double quotes') }}</p>

    <!-- XX It removes quotes in middle of string (Shouldn't) - SOLVED! -->
    <p title='{{ __('John "ShotGun" Nelson') }}'>{{ __('John with "double" quotes') }}</p>

    <!-- XX Didn't removes hashtag after replace - SOLVED! -->
    <p>{{ __('John with') }} "double"</p>

    <input Placeholder='{{ __('Some "text" - 2') }}' />

    <!-- XX Didn't finds with regex - SOLVED! (new regex) -->
    <li>{{ __('Up to 5 users simultaneously') }}</li>

    <!-- XX Didn't finds with regex - SOLVED! (new regex) -->
    <div class="ps-product__badge">
        <!-- XX Didn't finds with regex (v4) shorter then 4 -->
        <div class="ps-badge ps-badge--hot">{{ __('Hot') }}</div>
    </div>

    <!-- XX Didn't finds with regex if starting or ending with space - SOLVED! (With 3rd version of regex) -->
    <li> {{ __('Up to 5 users simultaneously') }} </li>

    <!-- No extra empty strings and mutching linebreaks with new text type suffix +TrimSpaces -->
    <li>
        {{ __('Up to 5 users simultaneously') }}
    </li>

    <p>Veelgestelde vragen over {{$serviceName}}</p>

    <!-- XX Not founds/replaces first part of string - SOLVED! (new extraction functions)  -->
    <p> {{ __('Veelgestelde vragen over') }}
        <span>{{$serviceName}}</span>
    </p>

    <!-- XX Not founds/replaces first part of string - SOLVED! (new extraction functions) -->
    <div>
        {{ __('OT-OT') }}
        <span>{{$serviceName}}</span>
        {{ __('CT-OT') }}
        <p>{{ __('Testing') }}</p>
        {{ __('CT-CT') }}
    </div>

    {{-- Blade comment --}}

</body>
</html>