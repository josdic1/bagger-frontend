import { TopicItem } from "./TopicItem";
import { NoResults } from "../../pages/NoResults";

export function TopicList({ topics = [] }) {
  if (!topics.length) {
    return <NoResults />;
  }

  return (
    <table className="topic-table">
      <thead>
        <tr>
          <th>Name</th>
          <th style={{ width: "160px" }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {topics.map((topic) => (
          <TopicItem key={topic.id} topic={topic} />
        ))}
      </tbody>
    </table>
  );
}
