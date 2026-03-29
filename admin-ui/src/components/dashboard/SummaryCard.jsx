const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="summary-card">
      {icon && <div className="summary-card-icon">{icon}</div>}
      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

export default SummaryCard;
