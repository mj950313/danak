interface Tab {
  label: string;
  value: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="my-10 flex sm:gap-5 text-lg sm:text-xl text-gray-400">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`py-2 px-4 ${
            activeTab === tab.value ? "text-white bg-blue-500" : ""
          }`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
