type MessageType = 
  | 'token'
  | 'user'
  | 'event'
  | 'news'
  | 'subscription'
  | 'applicationContactUs'
  | 'callRecording';

type MsgKey = string;

interface AuthMessages {
  [key: string]: { [key: string]: string };
}

const authObj: AuthMessages = {
  token: {
    UNAUTHORIZED_USER: 'You are unauthorized users',
    JWT_REQUIRED: 'Session has expired.',
    JWT_NEEDED: 'Empty JWT field in headers.',
    JWT_INVALID: 'Invalid JWT passed in headers.',
    JWT_EXPIRED: 'Expired JWT passed in headers.',
  },
  user: {
    UPDATE_USER_SUCCESS: 'The user has been successfully updated.',
    UPDATE_USER_FAIL: 'An error occurred while updating the user. Please try again later.',
    ADD_USER_SUCCESS: 'You have signed up successfully..',
    ADD_USER_FAIL: 'An error occurred while saving the user. Please try again later.',
    ADD_UPDATE_USER_FAIL: 'Unexpected error encountered while processing the user.',
    ALREADY_EXISTS_MAIL: 'The email address you entered is already registered. Kindly use another email address.',
    GET_ALL_SUCCESS: 'All users have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving users. Please try again later.',
    GET_USER_BY_ID_SUCCESS: 'The user details have been successfully retrieved.',
    GET_USER_BY_ID_FAIL: 'The user with this specified ID was not found.',
    DELETE_USER_SUCCESS: 'The user has been successfully deleted.',
    DELETE_USER_FAIL: 'An error occurred while deleting the user. Please try again later.',
    DELETE_USER_PROCESS_FAIL: 'An error occurred while processing the user deletion.',
    SIGNIN_FAIL: 'Invalid email or password.',
    SIGNIN_SUCCESS: 'You have signed in successfully!',
  },
  event: {
    UPDATE_EVENT_SUCCESS: 'The event has been successfully updated.',
    UPDATE_EVENT_FAIL: 'An error occurred while updating the event. Please try again later.',
    ADD_EVENT_SUCCESS: 'The event has been successfully created.',
    ADD_EVENT_FAIL: 'An error occurred while saving the event. Please try again later.',
    ADD_UPDATE_EVENT_FAIL: 'Unexpected error encountered while processing the event.',
    GET_ALL_SUCCESS: 'All events have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving events. Please try again later.',
    GET_EVENT_BY_ID_SUCCESS: 'The event details have been successfully retrieved.',
    GET_EVENT_BY_ID_FAIL: 'The event with this specified ID was not found.',
    DELETE_EVENT_SUCCESS: 'The event has been successfully deleted.',
    DELETE_EVENT_FAIL: 'An error occurred while deleting the event. Please try again later.',
    DELETE_EVENT_PROCESS_FAIL: 'An error occurred while processing the event deletion.',
    EVENT_JOIN: 'Event has been joined by you successfully.',
    EVENT_JOIN_FAIL: 'There are some error while joining event.',
  },
  news: {
    UPDATE_NEWS_SUCCESS: 'The news has been successfully updated.',
    UPDATE_NEWS_FAIL: 'An error occurred while updating the news. Please try again later.',
    ADD_NEWS_SUCCESS: 'The news has been successfully created.',
    ADD_NEWS_FAIL: 'An error occurred while saving the news. Please try again later.',
    ADD_UPDATE_NEWS_FAIL: 'Unexpected error encountered while processing the news.',
    GET_ALL_SUCCESS: 'All news have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving news. Please try again later.',
    GET_NEWS_BY_ID_SUCCESS: 'The news details have been successfully retrieved.',
    GET_NEWS_BY_ID_FAIL: 'The news with this specified ID was not found.',
    DELETE_NEWS_SUCCESS: 'The news has been successfully deleted.',
    DELETE_NEWS_FAIL: 'An error occurred while deleting the news. Please try again later.',
    DELETE_NEWS_PROCESS_FAIL: 'An error occurred while processing the news deletion.',
  },
  subscription: {
    UPDATE_SUBSCRIPTION_SUCCESS: 'The subscription has been successfully updated.',
    UPDATE_SUBSCRIPTION_FAIL: 'An error occurred while updating the subscription. Please try again later.',
    ADD_SUBSCRIPTION_SUCCESS: 'The subscription has been successfully created.',
    ADD_SUBSCRIPTION_FAIL: 'An error occurred while saving the subscription. Please try again later.',
    ADD_UPDATE_SUBSCRIPTION_FAIL: 'Unexpected error encountered while processing the subscription.',
    GET_ALL_SUCCESS: 'All subscription have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving subscription. Please try again later.',
    GET_SUBSCRIPTION_BY_ID_SUCCESS: 'The subscription details have been successfully retrieved.',
    GET_SUBSCRIPTION_BY_ID_FAIL: 'The subscription with this specified ID was not found.',
    DELETE_SUBSCRIPTION_SUCCESS: 'The subscription has been successfully deleted.',
    DELETE_SUBSCRIPTION_FAIL: 'An error occurred while deleting the subscription. Please try again later.',
    DELETE_SUBSCRIPTION_PROCESS_FAIL: 'An error occurred while processing the subscription deletion.',
    ADD_SUBSCRIPTION_USER_FAIL: 'An error occurred while processing the subscription plan with payment.',
    ADD_SUBSCRIPTION_USER_SUCCESS: 'Subscription has been taken successfully with payment.',
  },
  applicationContactUs: {
    UPDATE_APPLICATION_CONTACT_US_SUCCESS: 'The Application contact request has been successfully updated.',
    UPDATE_APPLICATION_CONTACT_US_FAIL: 'An error occurred while updating the contact request. Please try again later.',
    ADD_APPLICATION_CONTACT_US_SUCCESS: 'The contact request has been successfully created.',
    ADD_APPLICATION_CONTACT_US_FAIL: 'An error occurred while saving the contact request. Please try again later.',
    ADD_UPDATE_APPLICATION_CONTACT_US_FAIL: 'Unexpected error encountered while processing the contact request.',
    GET_ALL_SUCCESS: 'All contact requests have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving contact requests. Please try again later.',
    GET_APPLICATION_CONTACT_US_BY_ID_SUCCESS: 'The contact request details have been successfully retrieved.',
    GET_APPLICATION_CONTACT_US_BY_ID_FAIL: 'The contact request with this specified ID was not found.',
    DELETE_APPLICATION_CONTACT_US_SUCCESS: 'The contact request has been successfully deleted.',
    DELETE_APPLICATION_CONTACT_US_FAIL: 'An error occurred while deleting the contact request. Please try again later.',
    DELETE_APPLICATION_CONTACT_US_PROCESS_FAIL: 'An error occurred while processing the contact request deletion.',
  },
  callRecording: {
    UPDATE_CALL_RECORDING_SUCCESS: 'The call recording has been successfully updated.',
    UPDATE_CALL_RECORDING_FAIL: 'An error occurred while updating the call recording. Please try again later.',
    ADD_CALL_RECORDING_SUCCESS: 'The call recording has been successfully created.',
    ADD_CALL_RECORDING_FAIL: 'An error occurred while saving the call recording. Please try again later.',
    ADD_UPDATE_CALL_RECORDING_FAIL: 'Unexpected error encountered while processing the call recording.',
    GET_ALL_SUCCESS: 'All call recordings have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving call recordings. Please try again later.',
    GET_CALL_RECORDING_BY_ID_SUCCESS: 'The call recording details have been successfully retrieved.',
    GET_CALL_RECORDING_BY_ID_FAIL: 'The call recording with this specified ID was not found.',
    DELETE_CALL_RECORDING_SUCCESS: 'The call recording has been successfully deleted.',
    DELETE_CALL_RECORDING_FAIL: 'An error occurred while deleting the call recording. Please try again later.',
    DELETE_CALL_RECORDING_PROCESS_FAIL: 'An error occurred while processing the call recording deletion.',
  }
};

/**
 * Returns a message string for a given type and message key.
 */
export const msgHandler = (type: MessageType, msg: MsgKey): string => {
  if (!authObj[type]) return 'Invalid type';
  return authObj[type][msg] || 'Message not found';
};
