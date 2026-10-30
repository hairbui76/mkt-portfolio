// Feedback toolbar for reviewers: loaded only when the page is opened with ?feedback.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';

const host = document.createElement('div');
host.id = 'agentation-root';
document.body.append(host);
createRoot(host).render(<Agentation />);
