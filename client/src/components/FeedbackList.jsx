import React from 'react';
import { Stack } from 'react-bootstrap';
import FeedbackItem from './FeedbackItem';

export default function FeedbackList({ feedback }) {
  return (
    <Stack direction="vertical">
      {feedback?.map(item => (
        <FeedbackItem item={item}/>
      ))}
    </Stack>
  );
}
