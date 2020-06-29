const CONSUMER_KEY = `ck_3f44e06d010224cc8dff1cbe9496b250016cec3c`
const CONSUMER_SECRET = `cs_b1d628be68a43fb38737748b184fc8feee0137e1`

const WC_API_SERVER = `https://app-5ebcd147c1ac180f60a4e5bb.closte.com/wp-json/wc/v2`
const WC_URL_PRODUCTS = `${WC_API_SERVER}/products`

export const wooCommerceHandler = {
  name: "products",
  priority: 10,
  pattern: "/products",
  func: async ({ route, state, libraries }) => {
    
    // Fetch the about page.
    const productsResponse = await libraries.source.api.get({
      endpoint: "pages",
      params: { slug: "about", _embed: true }
    });

    // Populate the state with the response.
    const [aboutData] = await libraries.source.populate({
      response: aboutResponse,
      state
    });

    // Extract the project IDs.
    const aboutPage = state.source.page[aboutData.id];
    const projectIds = aboutPage.acf.flexible_layouts
      .find(layout => layout.acf_fc_layout === "projects_block")
      .projects.map(project => project.ID);

    // Fetch the projects with those ids.
    const projectsResponse = await libraries.source.api.get({
      endpoint: "projects",
      params: { includes: projectIds.join(",") }
    });

    // Populate the state with those projects.
    await libraries.source.populate({
      response: projectsResponse,
      state
    });

    // Populate data with info about /about.
    Object.assign(state.source.data[route], {
      id: aboutData.id,
      type: aboutData.type,
      isAboutPage: true,
      isPostType: true,
      projectIds
    });
  }
};