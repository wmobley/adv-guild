const QuestCard = ({ title, subtitle, description }) => (
  <article className="rounded-lg border border-guild-highlight/30 bg-guild-secondary p-6 shadow-sm transition hover:shadow-lg hover:border-guild-highlight/50">
    <h3 className="text-2xl font-bold text-guild-primary mb-1">{title}</h3>
    <p className="text-sm text-guild-neutral mb-3">{subtitle}</p>
    <p className="text-guild-text text-base">{description}</p>
  </article>
);

export default QuestCard;
