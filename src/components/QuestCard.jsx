const QuestCard = ({ title, subtitle, description }) => (
  <article className="rounded-lg border border-yellow-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
    <h3 className="text-2xl font-bold text-yellow-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
    <p className="text-gray-700 text-base">{description}</p>
  </article>
);

export default QuestCard;
