export const swapColumns = (
  array: BoardData,
  sourceIndex: number,
  destinationIndex: number,
) => {
  const movingColumn = array.splice(sourceIndex, 1)[0];
  array.splice(destinationIndex, 0, movingColumn);
  return array;
};

export const swapCard = (
  array: BoardData,
  dropables: {
    sourceDropableId: string;
    destinationDropableId?: string;
  },
  indexes: {
    sourceIndex: number;
    destinationIndex: number;
  },
) => {
  const arr = array;

  if (!dropables.destinationDropableId) {
    //If card is moved in the same section (the dropable asked is only one the same one)
    const section = arr.find(
      ({ sectionId }) => sectionId === dropables.sourceDropableId,
    );

    if (!section) return;

    const tasks = section.tasks;
    const movingCard = tasks.splice(indexes.sourceIndex, 1)[0];
    tasks.splice(indexes.destinationIndex, 0, movingCard);

    const newArr = arr.map((section) => {
      if (section.sectionId === dropables.sourceDropableId) {
        return {
          ...section,
          tasks,
        };
      } else {
        return section;
      }
    });

    return newArr;
  } else {
    // TODO: If card is moved in different section
    const sourceSection = arr.find(
      ({ sectionId }) => sectionId === dropables.sourceDropableId,
    );

    const destinationSection = arr.find(
      ({ sectionId }) => sectionId === dropables.destinationDropableId,
    );

    if (!sourceSection || !destinationSection) return;

    const sourceTasks = sourceSection.tasks;
    const destinationTasks = destinationSection.tasks;

    const movingCard = sourceTasks.splice(indexes.sourceIndex, 1)[0];
    destinationTasks.splice(indexes.destinationIndex, 0, movingCard);

    const newArr = arr.map((section) => {
      if (section.sectionId === dropables.sourceDropableId) {
        return {
          ...section,
          tasks: sourceTasks,
        };
      } else if (section.sectionId === dropables.destinationDropableId) {
        return {
          ...section,
          tasks: destinationTasks,
        };
      } else {
        return section;
      }
    });

    return newArr;
  }
};
