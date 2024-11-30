type DataWork = {
  company: string;
  title: string;
  typeJob: string;
  location: string;
  typeLocation: string;
  description: string;
};

export function findIndexWorkData(listData: DataWork[], data: DataWork) {
  const index = listData.findIndex(
    (item: DataWork) =>
      item.company === data.company &&
      item.title === data.title &&
      item.typeJob === data.typeJob &&
      item.location === data.location &&
      item.typeLocation === data.typeLocation &&
      item.description === data.description
  );
  return index;
}

export function findIndexSkills(listData: string[], data: string) {
  const index = listData.findIndex((item: string) => item === data);
  return index;
}

export function mapWorkHistory(data: string) {
  return data.split("{$}");
}

export function parseWorkHistory(data: string) {
  const elemData = mapWorkHistory(data);

  const workData: DataWork[] = [];
  elemData.map((_, idx) => {
    if (elemData[idx].match(/{\/}/g)?.length !== 5) {
      return data;
    }
    const [company, title, typeJob, location, typeLocation, description] =
      elemData[idx].split("{/}");
    const workHistory = {
      company: company,
      title: title,
      typeJob: typeJob,
      location: location,
      typeLocation: typeLocation,
      description: description,
    };
    workData.push(workHistory);
  });

  return workData;
}

export function parseSkills(data: string) {
  const elemData = data.split("{$}");
  return elemData;
}
