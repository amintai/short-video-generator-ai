import { Switch } from "@radix-ui/react-switch";

const Header = ({ isYearly, setIsYearly }) => {
    return (
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Pick the perfect plan for your <span className="text-primary">AI videos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                Transform your ideas into stunning short videos with our AI-powered platform.
                Choose the plan that works best for you.
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="toggleSwitch" className="sr-only peer" />
                        {/* <div className="w-12 h-6 bg-gray-300 peer-checked:bg-[#8338ec] rounded-full peer transition-all duration-300"></div> */}
                        {/* <div className="absolute w-5 h-5 bg-white rounded-full left-1 top-1 peer-checked:translate-x-6 transition-all duration-300"></div> */}
                </label>
                <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Yearly
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Save 20%
                    </span>
                </span>
            </div>
        </div>
    )
};

export default Header;