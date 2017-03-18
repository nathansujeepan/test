Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Toolbars_1 = require("react-md/lib/Toolbars");
const Spinner_1 = require("../components/generic/Spinner");
const ReactGridLayout = require("react-grid-layout");
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
const generic_1 = require("../generic");
const temp_1 = require("./temp");
const layout = temp_1.default.config.layout;
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.layouts = {};
        this.dataSources = {};
        this.state = {
            currentBreakpoint: 'lg',
            mounted: false,
            layouts: { lg: this.props.initialLayout },
        };
        this.onBreakpointChange = (breakpoint) => {
            var layouts = this.state.layouts;
            layouts[breakpoint] = layouts[breakpoint] || this.layouts[breakpoint];
            this.setState({
                currentBreakpoint: breakpoint,
                layouts: layouts
            });
        };
        this.onLayoutChange = (layout, layouts) => {
            //this.props.onLayoutChange(layout, layouts);
            var breakpoint = this.state.currentBreakpoint;
            var newLayouts = this.state.layouts;
            newLayouts[breakpoint] = layout;
            this.setState({
                layouts: newLayouts
            });
        };
        generic_1.PipeComponent.createDataSources(temp_1.default, this.dataSources);
        // For each column, create a layout according to number of columns
        var layouts = generic_1.Elements.loadLayoutFromDashboard(temp_1.default, temp_1.default);
        this.layouts = layouts;
        this.state.layouts = { lg: layouts['lg'] };
    }
    componentDidMount() {
        this.setState({ mounted: true });
        generic_1.PipeComponent.connectDataSources(this.dataSources);
    }
    render() {
        var { currentBreakpoint } = this.state;
        var layout = this.state.layouts[currentBreakpoint];
        // Creating visual elements
        var elements = generic_1.Elements.loadElementsFromDashboard(temp_1.default, layout);
        // Creating filter elements
        var { filters, additionalFilters } = generic_1.Elements.loadFiltersFromDashboard(temp_1.default);
        // Loading dialogs
        var dialogs = generic_1.Elements.loadDialogsFromDashboard(temp_1.default);
        return (<div style={{ width: '100%' }}>
        <Toolbars_1.default>
          {filters}
          <Spinner_1.default />
        </Toolbars_1.default>
        <ResponsiveReactGridLayout {...this.props.grid} layouts={this.state.layouts} onBreakpointChange={this.onBreakpointChange} onLayoutChange={this.onLayoutChange} 
        // WidthProvider option
        measureBeforeMount={false} 
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={this.state.mounted}>
          {elements}
        </ResponsiveReactGridLayout>
        {dialogs}
      </div>);
    }
}
// static propTypes = {}
Dashboard.defaultProps = {
    grid: {
        className: "layout",
        rowHeight: layout.rowHeight || 30,
        cols: layout.cols,
        breakpoints: layout.breakpoints
    }
};
exports.default = Dashboard;
