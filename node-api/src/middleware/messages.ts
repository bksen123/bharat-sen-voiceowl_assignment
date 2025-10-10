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
  Transcription: {
    UPDATE_TRANSCRIPTION_SUCCESS: 'The Transcription has been successfully updated.',
    UPDATE_TRANSCRIPTION_FAIL: 'An error occurred while updating the Transcription. Please try again later.',
    ADD_TRANSCRIPTION_SUCCESS: 'The Transcription has been successfully created.',
    ADD_TRANSCRIPTION_FAIL: 'An error occurred while saving the Transcription. Please try again later.',
    ADD_UPDATE_TRANSCRIPTION_FAIL: 'Unexpected error encountered while processing the Transcription.',
    GET_ALL_SUCCESS: 'All Transcription have been retrieved successfully.',
    GET_ALL_FAIL: 'An error occurred while retrieving Transcription. Please try again later.',
    GET_TRANSCRIPTION_BY_ID_SUCCESS: 'The Transcription details have been successfully retrieved.',
    GET_TRANSCRIPTION_BY_ID_FAIL: 'The Transcription with this specified ID was not found.',
    DELETE_TRANSCRIPTION_SUCCESS: 'The Transcription has been successfully deleted.',
    DELETE_TRANSCRIPTION_FAIL: 'An error occurred while deleting the Transcription. Please try again later.',
    DELETE_TRANSCRIPTION_PROCESS_FAIL: 'An error occurred while processing the Transcription deletion.',
    ADD_TRANSCRIPTION_USER_FAIL: 'An error occurred while processing the Transcription plan with payment.',
    ADD_TRANSCRIPTION_USER_SUCCESS: 'Transcription has been taken successfully with payment.',
  }
};

/**
 * Returns a message string for a given type and message key.
 */
export const msgHandler = (type: MessageType, msg: MsgKey): string => {
  if (!authObj[type]) return 'Invalid type';
  return authObj[type][msg] || 'Message not found';
};
