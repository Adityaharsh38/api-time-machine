
export function compareJSON(oldData, newData, currentPath = "") {
  const changes = [];

  if (
    oldData === null ||
    newData === null ||
    typeof oldData !== "object" ||
    typeof newData !== "object" ||
    Array.isArray(oldData) !== Array.isArray(newData)
  ) {
    if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
      changes.push({
        path: currentPath || "$",
        type: "MODIFIED",
        oldValue: oldData,
        newValue: newData
      });
    }

    return changes;
  }

  if (Array.isArray(oldData)) {
    const maxLength = Math.max(oldData.length, newData.length);

    for (let i = 0; i < maxLength; i++) {
      const path = `${currentPath}[${i}]`;

      if (i >= oldData.length) {
        changes.push({
          path,
          type: "ADDED",
          newValue: newData[i]
        });
      } else if (i >= newData.length) {
        changes.push({
          path,
          type: "REMOVED",
          oldValue: oldData[i]
        });
      } else {
        changes.push(
          ...compareJSON(oldData[i], newData[i], path)
        );
      }
    }

    return changes;
  }

  const keys = new Set([
    ...Object.keys(oldData),
    ...Object.keys(newData)
  ]);

  for (const key of keys) {
    const path = currentPath
      ? `${currentPath}.${key}`
      : key;

    if (!(key in oldData)) {
      changes.push({
        path,
        type: "ADDED",
        newValue: newData[key]
      });
    } else if (!(key in newData)) {
      changes.push({
        path,
        type: "REMOVED",
        oldValue: oldData[key]
      });
    } else {
      changes.push(
        ...compareJSON(oldData[key], newData[key], path)
      );
    }
  }

  return changes;
}
