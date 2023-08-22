<script>
  import { Button, Input, Skeleton, Card, Modal,Spinner } from "flowbite-svelte";
  import { Icon } from "flowbite-svelte-icons";
  import {fade} from "svelte/transition"
  import { afterUpdate } from "svelte";
  
  let cCount = 0;
  let popupModal = false;
  let selected = new Set();
  let matchedChannels = [];
  let query = "";
  let selectedList;
  let shouldScroll = true;
  let api = "https://corsproxy.io/?https://ts-api.videoready.tv/content-detail/pub/api/v1/channels?limit=999";
  let showSpinner = true;


  afterUpdate(()=>{
    if(selected.size && shouldScroll){
      selectedList.scrollTo({
        top: selectedList.scrollHeight,
        behavior: 'smooth',
      });
    }
  });


  async function filterMatched() {
    matchedChannels = (await channels).filter((item) => {
      return item.title.toLowerCase().includes(query.toLowerCase());
    });

    matchedChannels = matchedChannels;
  }

  async function copy() {
    if (selected.size) {
      navigator.clipboard
        .writeText(
          `module.exports = [${[...selected]
            .map((e) => {
              return `\n{ channel: "${e.title}", id: ${e.id} }`;
            })
            .join(",")}]`
        )
        .then(() => {
          popupModal = true;
        })
        .catch(() => {});
    }
  }

  async function getChannels() {
    let rsp;
    try {
      rsp = await fetch(api);
    } catch (error) {
      showSpinner = false;
    }
    let d = (await rsp.json()).data.list;
    d = d.map((/** @type {{ title: any; id: any; image: any; }} */ itm)=>{
      return ({ title: itm.title, id: itm.id, image: (itm.image).replace("https://", "https://i0.wp.com/") + '?w=120'  })
    })
    cCount = d.length;
    return d;
  }


  function addToSelected(item) {
    if (selected.has(item)) {
      selected.delete(item);
    } else {
      selected.add(item);
     
    }
    shouldScroll = true;
    selected = selected;
  }


  function removeSelected(item) {
    selected.delete(item);
    selected = selected;
    shouldScroll = false;
  }


  let channels = getChannels();
</script>


<Modal bind:open={popupModal} size="xs" autoclose outsideclose>
  <div class="text-center">
    <Icon name="info-circle-solid" class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
    <h3 class="mb-5 text-lg font-semibold text-gray-900 dark:text-gray-400">Copied {selected.size} channels</h3>
    <Button color="primary" size="lg" class="w-36">Got It</Button>
  </div>
</Modal>



<div class="flex flex-row">
  <main class="basis-full xl:basis-3/4 md:basis-3/5 pb-36">
    <div class="heading flex flex-grow flex-col md:flex-row items-center gap-4 md:gap-2 justify-between p-4 md:p-8 bg-white z-10">
      <div class="flex gap-2 items-center">
        <img class="md:w-11 w-8" src="/favicon.svg" alt="Logo" />
        <h1 class="text-sm font-bold text-slate-900 lg:text-base">TataPlay Channels ({cCount})</h1>
      </div>

      {#if cCount }
        <div class="relative block w-full md:w-auto">
          <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
          >
            <Icon name="search-outline" class="w-4 h-4 text-slate-900" />
          </div>
            <Input on:keyup={() => {filterMatched();}} bind:value={query} id="search-navbar" class="px-10 w-full xl:w-80 lg:w-48 md:w-40" placeholder="Search ..." />
            <div
            class="flex absolute inset-y-0 right-0 items-center pr-3"
          >
            {#if query.length}<Icon on:click={()=>{query = "";}} name="close-circle-solid" class="cursor-pointer text-primary-950" />{/if}
          </div>
        </div>
      {:else}
        {#if showSpinner}
          <Spinner/>
        {/if}
      {/if}

    </div>
    
    
    {#if !query.length}
     {#await channels }
      <div class="md:px-8 md:pb-8 px-4 pb-4">
        <Skeleton size="md" class="mb-8" />
        <Skeleton size="xxl" class="mb-8" />
        <Skeleton size="sm" />
      </div>
      {:then ch} 

      <div class="list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:px-8 md:pb-8 px-4 pb-4">
        {#each ch as channel, index}
          <Card on:click={() => { addToSelected(channel); }} class="{ selected.has(channel) ? 'active' : '' } card relative !py-10 items-center justify-center gap-4 shadow-none border-slate-100 rounded-xl hover:shadow-md hover:cursor-pointer transition ease-in">
            <Icon name="check-circle-solid" class="text-primary-950 absolute top-2 right-2 w-4 icon opacity-0 transition ease-in" />
            <img loading="lazy" src="{channel.image}" alt="{channel.title}" class="w-16" />
            <h3 class="text-center text-slate-800 font-semibold">{channel.title}</h3>
          </Card>
        {/each}
      </div>

      {:catch e}
        <div class="flex justify-center flex-col h-fit gap-1 items-center mt-8">
          <img class="w-48 mb-5" src="src/assets/error.svg" alt="Error">
          <h3 class="text-slate-800 font-bold text-xl">{e}</h3>
          <p class="text-slate-600">Please try again later</p>
        </div>
      {/await}

    {:else}
    <div class="list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:px-8 md:pb-8 px-4 pb-4">
      {#each matchedChannels as channel, index}
        <Card on:click={() => { addToSelected(channel); }} class="{ selected.has(channel) ? 'active' : '' } card relative !py-10 items-center justify-center gap-4 shadow-none border-slate-100 rounded-xl hover:shadow-md hover:cursor-pointer transition ease-in">
          <Icon name="check-circle-solid" class="text-primary-950 absolute top-2 right-2 w-4 icon opacity-0 transition ease-in" />
          <img loading="lazy" src="{channel.image}" alt="{channel.title}" class="w-16" />
          <h3 class="text-center text-slate-800 font-semibold">{channel.title}</h3>
        </Card>
      {/each}
    </div>
    {/if}
    

  </main>

  <aside class="basis-full xl:basis-1/4 md:basis-2/5 bg-slate-100 pb-4 md:pb-8 flex flex-col overflow-x-hidden fixed z-10 md:sticky w-full h-auto md:h-screen md:top-0 bottom-0 ">
    <div class="heading flex flex-row justify-between items-center md:p-8 p-4 bg-slate-100">
      <h2 class="text-sm font-bold text-slate-900 lg:text-base">Selected ({selected.size})</h2>
      <Button size="sm" on:click={() => {selected = new Set(); document.querySelector('html').scrollTo({ top:0, behavior:"smooth"})  }} pill color="light">Remove All</Button>
    </div>
    <div class="flex-1 min-h-0 overflow-y-auto no-scrollbar hidden md:block" id="selected-list" bind:this={selectedList}>
      {#each selected as item}
        <div in:fade={{ duration: 100 }} class="flex gap-1 justify-between py-5 odd:bg-slate-50 md:px-8 px-4">
          <h3 class="text-sm font-medium truncate text-ellipsis text-slate-800">{item.title}</h3>
          <Icon on:click={() => {removeSelected(item);}} name="close-circle-solid" class="cursor-pointer text-primary-950"></Icon>
        </div>
      {/each}
    </div>
    <Button on:click={copy} size="lg" class="copy-btn relative z-10 mt-0 md:mt-8">Copy {selected.size || ''} Channel{selected.size > 1 ? 's' : ''}</Button>
  </aside>
</div>

<style>
  main{
    min-height: 100vh;
  }
  main .heading{ top: 0; position: sticky;}
  .list h3{ font-size: 10px;}
  
</style>
