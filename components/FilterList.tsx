type FilterOption = {
  id: string;
  label: string;
};

type FilterListProps = {
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
};

const COLOR_MAP: Record<string, { bg: string; text: string; arrow: string }> = {
  'sesimbra': { bg: '#a0c52e', text: '#ffffff', arrow: '#ffffff' },
  'cape-verde': { bg: '#7acbe2', text: '#000000', arrow: '#000000' },
  'faial': { bg: '#1b5ba7', text: '#ffffff', arrow: '#ffffff' },
  'santa-maria': { bg: '#fadc00', text: '#000000', arrow: '#000000' },
  'peniche': { bg: '#f49519', text: '#000000', arrow: '#000000' },
  'madeira': { bg: '#e52924', text: '#ffffff', arrow: '#ffffff' },
  'sao-vicente': { bg: '#e52924', text: '#ffffff', arrow: '#ffffff' },
  'all': { bg: '#1e1e3f', text: '#ffffff', arrow: '#ffffff' },
};

export const FilterList: React.FC<FilterListProps> = ({
  options,
  selected,
  onSelect,
}) => {
  const getColors = (id: string) => {
    return COLOR_MAP[id] || { bg: '#fadc00', text: '#000000', arrow: '#000000' };
  };

  return (
    <div className="flex w-full flex-col gap-2 lg:max-w-[282px]">
      {options.map((option) => {
        const colors = getColors(option.id);
        const isSelected = option.id === selected;

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 transition-colors h-[38px] ${
              isSelected
                ? ''
                : 'bg-white hover:bg-gray-50'
            }`}
            style={isSelected ? { backgroundColor: colors.bg } : undefined}
          >
            <span
              className={`text-start uppercase leading-[120%] ${
                isSelected
                  ? 'text-[16px] font-bold'
                  : 'text-[15px] font-normal text-black'
              }`}
              style={isSelected ? { color: colors.text } : undefined}
            >
              {option.label}
            </span>
            {isSelected && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                  fill={colors.arrow}
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};