const getHierarchyMock = () => {
  return new Promise((resolve) => {
    resolve(Object.assign({ "code": 1, "data": { "projectId": 0, "moduleId": null } }));
  })
}

export default getHierarchyMock;
