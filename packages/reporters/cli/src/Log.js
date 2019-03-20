// @flow
import type {LogEvent} from '@parcel/types';
import {Box, Text, Color} from 'ink';
import Spinner from './Spinner';
import React from 'react';
import prettyError from './prettyError';
import * as Emoji from './emoji';

type StringOrErrorLogProps = {
  event: LogEvent
};

type StringLogProps = {
  event: {
    +message: string
  }
};

export function Log({event}: StringOrErrorLogProps) {
  switch (event.level) {
    case 'verbose':
    case 'info':
      return <InfoLog event={event} />;
    case 'progress':
      return <Progress event={event} />;
    case 'success':
      return <SuccessLog event={event} />;
    case 'error':
      return <ErrorLog event={event} />;
    case 'warn':
      return <WarnLog event={event} />;
  }

  throw new Error('Unknown log event type');
}

function InfoLog({event}: StringLogProps) {
  return <Text>{event.message}</Text>;
}

function Stack({
  err,
  emoji,
  color,
  ...otherProps
}: {
  err: string | Error,
  emoji: string,
  color: string
}) {
  let {message, stack} = prettyError(err, {color: true});
  return (
    <React.Fragment>
      <div>
        <Color keyword={color} {...otherProps}>
          {emoji} {message}
        </Color>
      </div>
      {stack && (
        <div>
          <Color gray>{stack}</Color>
        </div>
      )}
    </React.Fragment>
  );
}

function WarnLog({event}: StringOrErrorLogProps) {
  return <Stack err={event.message} emoji={Emoji.warning} color="yellow" />;
}

function ErrorLog({event}: StringOrErrorLogProps) {
  return <Stack err={event.message} emoji={Emoji.error} color="red" bold />;
}

function SuccessLog({event}: StringLogProps) {
  return (
    <Color green bold>
      {Emoji.success} {event.message}
    </Color>
  );
}

export function Progress({event}: StringLogProps) {
  return (
    <Box>
      <Color gray bold>
        <Spinner /> {event.message}
      </Color>
    </Box>
  );
}