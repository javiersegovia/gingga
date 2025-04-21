import * as React from 'react'
import { Check, ChevronsUpDown, XIcon } from 'lucide-react'
import { cn } from '@gingga/ui/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gingga/ui/components/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gingga/ui/components/popover'
import { Badge } from '@gingga/ui/components/badge'
import { Button } from '@gingga/ui/components/button'
import type { AIModel } from '~/features/ai/utils/ai-models'
import { modelIconPaths } from '~/features/ai/utils/ai-models'

interface SelectAIModelProps {
  models: AIModel[]
  value?: string
  onChange: (modelId: string | undefined) => void
  disabled?: boolean
  isClearable?: boolean
}

export function SelectAIModel({
  models,
  value,
  onChange,
  disabled = false,
  isClearable = false,
}: SelectAIModelProps) {
  const [open, setOpen] = React.useState(false)

  // Derive selectedModel from props
  const selectedModel = React.useMemo(
    () => models.find((model) => model.id === value),
    [models, value],
  )

  // Highlighted model for the preview popover
  const [highlightedModel, setHighlightedModel] = React.useState<AIModel | undefined>(
    selectedModel ?? models[0], // Default highlight to selected or first model
  )

  // Update highlighted model if selection changes externally or on open
  React.useEffect(() => {
    setHighlightedModel(selectedModel ?? models[0])
  }, [selectedModel, models])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!highlightedModel) return // Should not happen if models array is not empty

    const currentIndex = models.findIndex((model) => model.id === highlightedModel.id)
    if (currentIndex === -1) return // Should not happen

    let nextIndex = currentIndex
    if (event.key === 'ArrowUp' && currentIndex > 0) {
      nextIndex = currentIndex - 1
    } else if (event.key === 'ArrowDown' && currentIndex < models.length - 1) {
      nextIndex = currentIndex + 1
    }

    if (nextIndex !== currentIndex) {
      setHighlightedModel(models[nextIndex])
    }
  }

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    onChange(undefined)
  }

  const triggerLabel = selectedModel ? (
    <>
      <img
        src={modelIconPaths[selectedModel.provider]}
        alt={selectedModel.provider}
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="text-xs">{selectedModel.name}</span>
      {selectedModel.tag && (
        <Badge
          variant="default"
          size="xs"
          className={cn(
            'font-title ml-2',
            selectedModel.tag === 'Premium' && 'bg-pink-400',
            selectedModel.tag === 'Enterprise' && 'bg-purple-400',
          )}
        >
          {selectedModel.tag}
        </Badge>
      )}
    </>
  ) : (
    <span className="text-muted-foreground text-xs">Auto-select</span>
  )

  return (
    <div className="relative z-50 w-full">
      {/* Clear Button - positioned absolutely */}
      {isClearable && selectedModel && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground/60 hover:text-destructive absolute top-1/2 right-[28px] z-10 -translate-y-1/2 transform cursor-pointer rounded-full p-1 transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          aria-label="Clear selection"
          tabIndex={0}
        >
          <XIcon className="h-5 w-5" />
        </button>
      )}

      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          if (newOpen) {
            setHighlightedModel(selectedModel ?? models[0])
          }
          setOpen(newOpen)
        }}
      >
        <PopoverTrigger asChild>
          {/* Added padding-right (pr-12) to make space for the absolute clear button and chevron */}
          <Button
            variant="outline"
            hover="noShadow"
            role="combobox"
            size="md"
            aria-expanded={open}
            className="bg-background w-full justify-between pr-12"
            disabled={disabled}
          >
            <div className="flex flex-grow items-center gap-2 overflow-hidden">
              {triggerLabel}
            </div>
            {/* Chevron moved outside the nested div */}
            <ChevronsUpDown className="text-muted-foreground/60 absolute top-1/2 right-[8px] h-4 w-4 shrink-0 -translate-y-1/2 transform" />
          </Button>
        </PopoverTrigger>
        <div className="relative">
          <PopoverContent className="w-[304px] p-0" align="start">
            <Command className="bg-background w-[302px]" onKeyDown={handleKeyDown}>
              <CommandInput placeholder="Search models..." />
              <CommandList>
                <CommandEmpty>No models found.</CommandEmpty>
                <CommandGroup>
                  {models.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.name} // Use name for search filtering
                      disabled={
                        disabled || model.tag === 'Premium' || model.tag === 'Enterprise'
                      } // Also disable if parent disables
                      onSelect={() => {
                        if (!disabled) {
                          onChange(model.id) // Call onChange prop
                          setOpen(false)
                        }
                      }}
                      onMouseEnter={() => setHighlightedModel(model)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={modelIconPaths[model.provider]}
                          alt={model.provider}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span className="text-xs">{model.name}</span>
                        {model.tag && (
                          <Badge
                            variant="default"
                            size="xs"
                            className={cn(
                              'font-title',
                              model.tag === 'Premium' && 'bg-pink-400',
                              model.tag === 'Enterprise' && 'bg-purple-400',
                            )}
                          >
                            {model.tag}
                          </Badge>
                        )}
                      </div>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedModel?.id === model.id ? 'opacity-100' : 'opacity-0', // Use optional chaining
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
          {/* Preview Popover */}
          {/* {open &&
            highlightedModel && ( // Check if highlightedModel exists
              <div className="bg-popover text-popover-foreground absolute top-0 left-[calc(100%+4px)] z-20 w-[300px] rounded-md border p-4 shadow-md">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={modelIconPaths[highlightedModel.provider]}
                        alt={highlightedModel.provider}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <h4 className="text-sm">
                        {highlightedModel.provider} — {highlightedModel.name}
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {highlightedModel.description}
                    </p>
                  </div>
                </div>
              </div>
            )} */}
        </div>
      </Popover>
    </div>
  )
}
