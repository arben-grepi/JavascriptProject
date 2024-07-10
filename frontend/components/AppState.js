class AppState {
  constructor() {
    this.peppiFile = null;
    this.courseFile = null;
    this.enrolled = null;
    this.respondents = null;
    this.groups = null;
    this.ungrouped = [];
  }

  getPeppiFile = () => {
    return this.peppiFile;
  };

  setPeppiFile = (file) => {
    this.peppiFile = file;
  };

  clearPeppiFile = () => {
    this.peppiFile = null;
  };

  getCourseFile = () => {
    return this.courseFile;
  };

  setCourseFile = (file) => {
    this.courseFile = file;
  };

  clearCourseFile = () => {
    this.courseFile = null;
  };

  getEnrolled = () => {
    return this.enrolled;
  };

  setEnrolled = (data) => {
    this.enrolled = data;
  };

  clearEnrolled = () => {
    this.enrolled = null;
  };

  getRespondents = () => {
    return this.respondents;
  };

  setRespondents = (data) => {
    this.respondents = data;
  };

  clearRespondents = () => {
    this.respondents = null;
  };

  getGroups = () => {
    return this.groups;
  };

  setGroups = (data) => {
    this.groups = data;
  };

  clearGroups = () => {
    this.groups = null;
  };

  getUngrouped = () => {
    return this.ungrouped;
  };

  setUngrouped = (data) => {
    this.ungrouped = data;
  };

  clearUngrouped = () => {
    this.ungrouped = [];
  };
}

export default AppState;
