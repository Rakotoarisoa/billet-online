import React from 'react';

const EventContext = React.createContext({})

export const EventProvider = EventContext.Provider
export const EventConsumer = EventContext.Consumer
export default EventContext;